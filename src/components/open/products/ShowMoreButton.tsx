import { Button } from "@/components/ui/Button";

interface Props{
    onClick:  () => void;
    loading: boolean;
    total: number;
    loaded: number;
}

export const ShowMoreButton = ({onClick, loading, total, loaded}: Props) => {
    const remaining = total - loaded;
    if (loading) {
        return null;
    }

    return (
    <div className="text-center mt-8">
      <Button onClick={onClick} loading={loading}>
        Show More ({remaining} left)
      </Button>
    </div>
  );
}