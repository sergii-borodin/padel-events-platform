"use client";

import { useState, ChangeEvent, DragEvent } from "react";

type VenueType = "inside" | "outside";

export default function CreateEventForm() {
  const [venueType, setVenueType] = useState<VenueType>("inside");
  const [selectedMin, setSelectedMin] = useState(0);
  const [selectedMax, setSelectedMax] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const addTag = () => {
    const value = tagInput.trim().toLowerCase();
    if (!value || tags.includes(value)) return;
    setTags([...tags, value]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const buildPayload = () => ({
    venueType,
    minRating: selectedMin,
    maxRating: selectedMax,
    tags,
    image: imageFile?.name,
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Create Event</h1>

      <section className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Title" />
        <textarea className="w-full border p-2 rounded" placeholder="Description" />
        <textarea className="w-full border p-2 rounded" placeholder="Overview" />
      </section>

      <section>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="border-2 border-dashed rounded p-8 text-center"
        >
          <input type="file" accept="image/*" onChange={onFileChange} />
          {imageFile && <p>{imageFile.name}</p>}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <input className="border p-2 rounded" placeholder="Venue" />
        <input className="border p-2 rounded" placeholder="Location" />
      </section>

      <section>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setVenueType("inside")}
            className="border px-4 py-2 rounded"
          >
            Indoor
          </button>
          <button
            type="button"
            onClick={() => setVenueType("outside")}
            className="border px-4 py-2 rounded"
          >
            Outdoor
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div>
          <p>Min rating: {selectedMin}</p>
          {[0, 1, 2, 3, 4].map((n) => (
            <button key={n} onClick={() => setSelectedMin(n)} className="m-1 border px-2">
              {n}
            </button>
          ))}
        </div>

        <div>
          <p>Max rating: {selectedMax}</p>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setSelectedMax(n)} className="m-1 border px-2">
              {n}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="border p-2 rounded flex-1"
            placeholder="Tag"
          />
          <button type="button" onClick={addTag} className="border px-4">
            Add
          </button>
        </div>

        <div className="flex gap-2 mt-2 flex-wrap">
          {tags.map((tag) => (
            <button key={tag} onClick={() => removeTag(tag)} className="border rounded px-2 py-1">
              {tag} ×
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => console.log(buildPayload())}
        className="border px-4 py-2 rounded"
      >
        Create Event
      </button>
    </div>
  );
}
