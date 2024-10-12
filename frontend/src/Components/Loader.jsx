import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Loader2 className="animate-spin text-white" />
    </div>
  );
};

export default Loader;
