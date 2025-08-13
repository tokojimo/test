import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Harvest = {
  id?: string;
  date: string;
  rating: number;
  comment: string;
  photos: string[];
};

export function EditHarvestModal({
  open,
  onClose,
  onSave,
  onDelete,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (h: Harvest) => void;
  onDelete?: () => void;
  initial?: Harvest;
}) {
  const [date, setDate] = useState(initial?.date || "");
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [comment, setComment] = useState(initial?.comment || "");
  const [photos, setPhotos] = useState<string[]>(initial?.photos || []);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ date?: string }>({});

  useEffect(() => {
    setDate(initial?.date || "");
    setRating(initial?.rating ?? 0);
    setComment(initial?.comment || "");
    setPhotos(initial?.photos || []);
  }, [initial, open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: { date?: string } = {};
    if (!date) err.date = "Requis";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    onSave({ id: initial?.id, date, rating, comment, photos });
    setLoading(false);
    onClose();
  };

  const importPhotos = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map(f => URL.createObjectURL(f));
    setPhotos(p => [...p, ...urls]);
  };

  const removePhoto = (url: string) => {
    if (confirm("Supprimer cette photo ?")) setPhotos(p => p.filter(u => u !== url));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Modifier la cueillette</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm">
              Date
            </label>
            <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
            {errors.date && <p className="text-xs text-danger">{errors.date}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="rating" className="text-sm">
              Note
            </label>
            <Select id="rating" value={String(rating)} onChange={e => setRating(parseInt(e.target.value, 10))}>
              {[0, 1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label htmlFor="comment" className="text-sm">
              Commentaire
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="h-24 w-full rounded-md border border-border bg-paper px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm">Galerie</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {photos.map(url => (
                <div key={url} className="relative aspect-square">
                  <img src={url} className="w-full h-full object-cover rounded-md border border-border" alt="" />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => removePhoto(url)}
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <input
              id="file"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => importPhotos(e.target.files)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => document.getElementById("file")?.click()}
            >
              Importer des photos
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 flex-wrap mt-2">
          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              className="text-danger border border-danger hover:bg-danger/10"
              onClick={onDelete}
            >
              Supprimer
            </Button>
          )}
          <div className="ml-auto flex gap-2 w-full sm:w-auto">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1 sm:flex-none">
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
              {loading && (
                <span className="mr-2 inline-block w-4 h-4 rounded-full border-2 border-border border-t-transparent animate-spin" />
              )}
              Enregistrer
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default EditHarvestModal;

