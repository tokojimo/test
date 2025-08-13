import React, { useEffect, useMemo, useRef, useState } from "react";
import { loadMushrooms } from "@/services/dataLoader";
import type { Mushroom } from "@/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import SpeciesPicker, { SpeciesOption } from "@/components/mushrooms/SpeciesPicker";
import MushroomCard from "@/components/mushrooms/MushroomCard";
import MushroomCardSkeleton from "@/components/mushrooms/MushroomCard.skeleton";
import MushroomDetails from "@/components/mushrooms/MushroomDetails";

function normalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function levenshtein(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function matches(name: string, q: string) {
  const n = normalize(name);
  const nq = normalize(q);
  return n.includes(nq) || levenshtein(n, nq) <= 1;
}

export default function MushroomsIndex() {
  const [data, setData] = useState<Mushroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [access, setAccess] = useState("all");
  const [sort, setSort] = useState("alpha");
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [details, setDetails] = useState<Mushroom | null>(null);
  const [visible, setVisible] = useState(12);
  const moreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadMushrooms()
      .then((m) => {
        setData(m);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!moreRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible((v) => v + 12);
      }
    });
    observer.observe(moreRef.current);
    return () => observer.disconnect();
  }, [moreRef.current]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    data.forEach((m) => m.category && set.add(m.category));
    return Array.from(set);
  }, [data]);

  const filteredBase = useMemo(() => {
    return data.filter((m) => {
      if (search && !matches(m.name, search)) return false;
      if (category !== "all" && m.category !== category) return false;
      if (access === "free" && m.premium) return false;
      if (access === "premium" && !m.premium) return false;
      return true;
    });
  }, [data, search, category, access]);

  const speciesOptions: SpeciesOption[] = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredBase.forEach((m) => {
      counts[m.id] = (counts[m.id] || 0) + 1;
    });
    return Object.keys(counts).map((id) => ({
      id,
      label: data.find((m) => m.id === id)?.name || id,
      count: counts[id],
    }));
  }, [filteredBase, data]);

  const filtered = useMemo(() => {
    const afterSpecies = selectedSpecies.length
      ? filteredBase.filter((m) => selectedSpecies.includes(m.id))
      : filteredBase;
    const sorted = [...afterSpecies].sort((a, b) => {
      if (sort === "alpha") return a.name.localeCompare(b.name);
      return (b.popularity || 0) - (a.popularity || 0);
    });
    return sorted;
  }, [filteredBase, selectedSpecies, sort]);

  const displayed = filtered.slice(0, visible);

  if (loading) {
    return (
      <div className="container py-4">
        <div className="grid-responsive">
          {Array.from({ length: 8 }).map((_, i) => (
            <MushroomCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4 space-y-4">
        <p className="text-foreground">Erreur de chargement.</p>
        <button
          className="underline text-foreground"
          onClick={() => {
            setLoading(true);
            loadMushrooms()
              .then((m) => {
                setData(m);
                setError(false);
              })
              .catch(() => setError(true))
              .finally(() => setLoading(false));
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4 space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
        <Input
          placeholder="Rechercher"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="md:w-40">
          <option value="all">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select value={access} onChange={(e) => setAccess(e.target.value)} className="md:w-40">
          <option value="all">Tous accès</option>
          <option value="free">Gratuit</option>
          <option value="premium">Premium</option>
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} className="md:w-40">
          <option value="alpha">Alphabétique</option>
          <option value="popular">Popularité</option>
        </Select>
      </div>

      <SpeciesPicker
        options={speciesOptions}
        selected={selectedSpecies}
        onToggle={(id) =>
          setSelectedSpecies((curr) =>
            curr.includes(id) ? curr.filter((s) => s !== id) : [...curr, id]
          )
        }
      />

      {filtered.length === 0 ? (
        <div className="grid-responsive">
          <div className="flex flex-col items-center justify-center rounded-lg border border-border p-6 text-center">
            <p className="mb-2 text-foreground/70">Aucun résultat</p>
            <button
              className="underline"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setAccess("all");
                setSelectedSpecies([]);
              }}
            >
              Effacer filtres
            </button>
          </div>
        </div>
      ) : (
        <div
          data-testid="mushrooms-grid"
          className="grid w-full gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {displayed.map((m) => (
            <MushroomCard key={m.id} mushroom={m} onSelect={() => setDetails(m)} />
          ))}
        </div>
      )}
      <div ref={moreRef} />
      <MushroomDetails mushroom={details} open={!!details} onClose={() => setDetails(null)} />
    </div>
  );
}

