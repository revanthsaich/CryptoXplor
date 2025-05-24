import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await api.get('/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const newOrders = response.data;
      console.log('Fetched orders:', newOrders);
      
      // Replace existing orders with new ones
      setOrders(newOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const [isSelling, setIsSelling] = useState(false);

  const sellOrder = async (orderId, quantity, buyPrice, coinId, currency) => {
    try {
      setIsSelling(true);
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      console.log('Fetching current price for:', coinId, 'in', currency);
      
      // Get current price for P&L calculation
      const response = await api.get(`/coins/${coinId}`, {
        params: { currency },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Price API response:', response.data);
      
      if (!response.data?.market_data?.current_price?.[currency.toLowerCase()]) {
        throw new Error('Invalid price data received from API');
      }
      
      const currentPrice = response.data.market_data.current_price[currency.toLowerCase()];
      
      // Calculate P&L
      const pnl = (currentPrice - buyPrice) * quantity;
      const pnlPercentage = ((currentPrice - buyPrice) / buyPrice) * 100;
      
      console.log('Calculated P&L:', { currentPrice, buyPrice, quantity, pnl, pnlPercentage });

      // Update order status to completed and add P&L
      console.log('Updating order with sell data...');
      const updateResponse = await api.put(
        `/orders/${orderId}/sell`,
        { 
          sellPrice: currentPrice,
          pnl,
          pnlPercentage,
          completedAt: new Date().toISOString()
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Order update response:', updateResponse.data);

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? {
                ...order,
                status: 'completed',
                completedAt: new Date().toISOString(),
                sellPrice: currentPrice,
                pnl,
                pnlPercentage
              }
            : order
        )
      );

      return updateResponse.data;
    } catch (error) {
      console.error('Error in sellOrder:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      throw error;
    } finally {
      setIsSelling(false);
    }
  };

  const addOrder = async (order) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await api.post('/orders', {
        ...order,
        userId: order.userId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const newOrder = response.data;
      
      // Add the new order to state
      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      loading, 
      addOrder, 
      fetchOrders, 
      sellOrder,
      isSelling 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
