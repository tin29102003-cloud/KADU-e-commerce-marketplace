import { useRouter, useSearchParams } from "next/navigation";

export const useFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pushFilters = (filters: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(filters).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  const removeFilter = (key: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    key.forEach((v) => params.delete(v));
    router.push(`?${params.toString()}`, { scroll: false });
  };
  return { pushFilters, removeFilter };
};
