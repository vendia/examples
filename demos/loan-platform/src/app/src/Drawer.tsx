import { Fragment, useState, ReactNode, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

export function Drawer({
  children,
  theme,
  isOpen,
  isWide,
  setIsOpen,
}: {
  children: ReactNode;
  theme: string;
  isOpen: boolean;
  isWide: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={setIsOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-800 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-200 sm:duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200 sm:duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div
                className={`pointer-events-auto relative w-screen ${
                  isWide ? 'max-w-4xl' : 'max-w-sm'
                }`}
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-base-100 py-6 shadow-xl">
                  <div
                    className="relative mt-6 flex-1 px-4 sm:px-6"
                    data-theme={theme}
                  >
                    {children}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
