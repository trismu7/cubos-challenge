"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { deleteMovieAction } from "@/lib/actions/movie/delete/deleteMovie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteMovieDialog({ movieId }: { movieId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDeleteMovie = async () => {
    const result = await deleteMovieAction(movieId);
    if (result.success) {
      setIsOpen(false);
      toast.success(result.message);

      router.push("/main");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Deletar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar filme</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar este filme?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteMovie}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
