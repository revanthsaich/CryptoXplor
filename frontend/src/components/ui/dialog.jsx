import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

export function DialogDemo({
  open,
  onOpenChange,
  title,
  description,
  inputValue,
  setInputValue,
  onConfirm,
  confirmLabel = 'Confirm',
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fadeIn dark:bg-black/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-xl focus:outline-none data-[state=open]:animate-slideIn dark:bg-gray-900 dark:text-gray-100">
          <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-1 mb-4 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </Dialog.Description>
          <div className="mb-4">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter name"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={onConfirm}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {confirmLabel}
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:text-gray-800 focus:outline-none dark:text-gray-400 dark:hover:text-white"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
