"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  searchFiltersSchema,
  type SearchFilters,
} from "@/lib/formSchemas/searchFiltersSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

export default function FiltersDialog({
  onApply,
  onClear,
}: {
  onApply?: (filters: SearchFilters) => void;
  onClear?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filtersActiveCount, setFiltersActiveCount] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const defaultValues: SearchFilters = {
    releaseStart: undefined,
    releaseEnd: undefined,
    durationMin: undefined,
    durationMax: undefined,
    imdbRatingMin: undefined,
    imdbRatingMax: undefined,
    imdbVotesMin: undefined,
    imdbVotesMax: undefined,
  };

  const form = useForm<SearchFilters>({
    resolver: zodResolver(searchFiltersSchema),
    defaultValues,
  });

  function handleApply(values: SearchFilters) {
    onApply?.(values);
    setIsOpen(false);

    const activeFilters = Object.values(values).filter(
      (value) => value !== undefined
    );
    setFiltersActiveCount(activeFilters.length);
  }

  function handleClear() {
    form.reset(defaultValues, { keepDirty: false, keepTouched: false });
    onClear?.();
    setFiltersActiveCount(0);
    setResetKey((k) => k + 1);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          Filtros {filtersActiveCount > 0 && `(${filtersActiveCount})`}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            key={resetKey}
            className="space-y-4"
            onSubmit={form.handleSubmit(handleApply)}
          >
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="releaseStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data inicial</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? new Date(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="releaseEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data final</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? new Date(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="durationMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração mínima (minutos)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração máxima (minutos)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="180"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="imdbRatingMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nota mínima</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imdbRatingMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nota máxima</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="imdbVotesMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Votos mínimos</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imdbVotesMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Votos máximos</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100000"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={handleClear}>
                Limpar
              </Button>
              <Button type="submit">Aplicar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
