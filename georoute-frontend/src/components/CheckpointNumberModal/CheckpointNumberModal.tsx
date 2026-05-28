import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import type { RootState } from "../../providers/store";
import { closeCheckpointModal } from "../../providers/paths/checkpoint-modal-reducer";
import { addMarker, editPoint } from "../../providers/paths/path-reducer";
import type { IMarker, IPoint } from "../../services/types/Path";

interface FormValues {
  name: string;
}

function CheckpointNumberModal() {
  const dispatch = useDispatch();
  const { isOpen, pointId } = useSelector(
    (state: RootState) => state.checkpointModal,
  );
  const currentPathId = useSelector(
    (state: RootState) => state.currentPathId.currentPathId,
  );
  const currentPathVariantId = useSelector(
    (state: RootState) => state.currentPathVariantId.currentPathVariantId,
  );
  const paths = useSelector(
    (state: RootState) => state.pathObject.present.paths,
  );

  const path = paths[currentPathId];
  const point: IPoint | undefined =
    path?.variants[currentPathVariantId]?.path[pointId];

  const usedNames = useMemo(() => {
    if (!path) return new Set<string>();
    return new Set(
      Object.values(path.markers)
        .map((m) => m.name?.trim().toLowerCase())
        .filter((n): n is string => !!n),
    );
  }, [path]);

  const schema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .trim()
          .min(1, "Введите название КП")
          .refine(
            (v) => !usedNames.has(v.toLowerCase()),
            "Это название уже занято другим КП маршрута",
          ),
      }),
    [usedNames],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ name: "" });
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    dispatch(closeCheckpointModal());
  };

  const onSubmit = (values: FormValues) => {
    if (!point) {
      dispatch(closeCheckpointModal());
      return;
    }
    const name = values.name.trim();
    const markerId = crypto.randomUUID();
    const pointWithMarker: IPoint = { ...point, markerId };
    const newMarker: IMarker = {
      id: markerId,
      pathId: point.pathId,
      name,
      points: [pointWithMarker],
      order: 0,
      lat: point.lat,
      lng: point.lng,
    };
    dispatch(addMarker(newMarker));
    dispatch(editPoint(pointWithMarker));
    dispatch(closeCheckpointModal());
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>Название КП</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Название"
            size="small"
            error={Boolean(errors.name)}
            helperText={errors.name?.message ?? " "}
            {...register("name")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={!isValid}>
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CheckpointNumberModal;
