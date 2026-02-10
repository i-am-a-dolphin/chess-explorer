"use client";

import { SearchIcon } from "lucide-react";

type InputShapedButtonProps = {
  onClick: () => void;
  placeholder: string;
  title?: string;
};

export const InputShapedButton = ({
  onClick,
  placeholder,
  title,
}: InputShapedButtonProps) => {
  return (
    <div className="space-y-2">
      <button
        onClick={onClick}
        className="flex w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        title={title}
      >
        <SearchIcon className="size-4 text-gray-400" />
        <span className="text-gray-400">{placeholder}</span>
      </button>
    </div>
  );
};
