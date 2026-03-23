import type { IPath } from "../../services/types/Path";

interface IPathsObject { [index: string]: IPath; }

export const initialId = crypto.randomUUID();
export const initialVariantId = crypto.randomUUID();


export const initialStateRedux: IPathsObject = ({ 
  [initialId]: {
    id: initialId,
    name: 'Маршрут',
    color: '#ff0000',
    distance: 0,
    checked: true,
    main: [],
    variants: {
      [initialVariantId]: {
        id: initialVariantId,
        pathId: initialId,
        name: 'Вариант 1',
        color: '#ff0000',
        distance: 0,
        checked: true,
        path: {},
      }
    },
  }
})