import { useEffect, useState } from "react";

export const useMounted = () => {
  const [mounted, setMounted] = useState(false);

  //eslint-disable-next-line
  useEffect(() => setMounted(true), []);

  return mounted;
};
