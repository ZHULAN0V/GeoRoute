import type { IPath } from "../../services/types/Path";

interface IPathsObject { [index: string]: IPath; }

export const initialId = crypto.randomUUID();

export const initialStateRedux: IPathsObject = ({
  [initialId]: {
    id: initialId,
    name: 'Маршрут',
    color: '#ff0000',
    checked: true,
    markers: {},
    segments: {},
  }
})
