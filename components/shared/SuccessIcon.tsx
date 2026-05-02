import { CheckIcon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";

export default function SuccessIcon() {
    //render a spinner for 1 second then render the check icon
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }, []);
    return isLoading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />;

  };