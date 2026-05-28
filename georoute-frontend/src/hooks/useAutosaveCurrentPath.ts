import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import type { RootState } from "../providers/store";
import type { IPath } from "../services/types/Path";
import { usePostFile } from "./usePostFile";
import createGPXStringFromPath from "../lib/helpers/createGPXStringFromPath";

const AUTOSAVE_DEBOUNCE_MS = 700;

export const useAutosaveCurrentPath = () => {
  const currentPathId = useSelector(
    (s: RootState) => s.currentPathId.currentPathId,
  );
  const path = useSelector((s: RootState) => s.pathObject.paths[currentPathId]);

  const { mutate } = usePostFile({
    onError: (err: unknown) => {
      console.warn("[autosave] failed after retries", err);
    },
  });

  const save = useDebouncedCallback((snapshot: IPath) => {
    const gpxData = createGPXStringFromPath(snapshot);
    mutate({ gpxData, fileName: snapshot.id });
  }, AUTOSAVE_DEBOUNCE_MS);

  const prevRef = useRef<IPath | undefined>(undefined);

  useEffect(() => {
    const prev = prevRef.current;

    if (prev && prev.id !== path?.id) {
      save.flush();
    }

    if (path && prev !== path && prev !== undefined) {
      save(path);
    }

    prevRef.current = path;
  }, [path, save]);

  useEffect(
    () => () => {
      save.flush();
    },
    [save],
  );
};
