import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IMarker, IPath, IPathVariant, IPathVariantPointsObject, IPoint } from '../../services/types/Path'
import { initialStateRedux } from '../../lib/helpers/initialState'
import createOrderedPath from '../../lib/helpers/createOrderedPath';

// todo разбить на несколько слайсов, 
// так как сейчас слишком много логики в одном месте, 
// и она не всегда связана между собой

export interface IPathsObject { [index: string]: IPath; }

interface IAddManyPointsProps {
  pathId: string,
  pathVariantId: string,
  points: IPathVariantPointsObject
}

interface IAddManyPointsFromMatchedProps {
  pathId: string,
  pathVariantId: string,
  poinstArray: [number, number][],
}

interface IAddPointBetweenProps {
  prevPoint: IPoint,
  nextPoint: IPoint,
}

interface IAddPathFromImportProps {
  points: [number, number][],
}

export interface PathState {
  paths: IPathsObject
}

const initialState: PathState = {
  paths: initialStateRedux,
}

export const pathSlice = createSlice({
  name: 'path',
  initialState,
  reducers: {
    // Действия с основными путями
    addPath: (state, action: PayloadAction<IPath>) => {
      state.paths[action.payload.id] = action.payload;
    },
    deletePath: (state, action: PayloadAction<string>) => {
      delete state.paths[action.payload];
    },
    editPath: (state, action: PayloadAction<IPath>) => {
      state.paths[action.payload.id] = action.payload;
    },
    addPathFromImport: (state, action: PayloadAction<IAddPathFromImportProps>) => {
      const latlngArray = action.payload.points;
      const id = crypto.randomUUID();
      const variantId = crypto.randomUUID();

      // todo вынести логику в helper она повторяется
      const path = latlngArray.map(x => ({
        id: crypto.randomUUID(),
        nextId: '',
        prevId: '',
        pathId: id,
        pathVariantId: variantId,
        lat: x[0],
        lng: x[1],
      } as IPoint)).reduce((acc: IPathVariantPointsObject, point, index, arr) => {
        if (index > 0) {
          point.prevId = arr[index - 1].id;
        }
        if (index < arr.length - 1) {
          point.nextId = arr[index + 1].id;
        }
        return {...acc, [point.id]: point};
      }, {} as IPathVariantPointsObject);


      state.paths[id] = {
        id: id,
        name: 'new path',
        color: '#ff0000',
        distance: 0,
        checked: true,
        main: [],
        markers: {},
        variants: {
          [variantId]: {
            id: variantId,
            pathId: id,
            name: 'Вариант 1',
            color: '#ff0000',
            distance: 0,
            isVisible: true,
            path: path,
          }
        },
      };
      // state.paths[action.payload.id] = action.payload;
    },
    addPathsFromNames: (state, action: PayloadAction<{names: string[]}>) => {
      const {names} = action.payload;

      const newPaths = names.map(name => ({
        id: crypto.randomUUID(),
        name: name,
        color: '#ff0000',
        distance: 0,
        checked: true,
        main: [], // массив координат
        markers: {},
        variants: {}, // объект координат с ключами в виде id
      }))
      .reduce((acc: IPathsObject, path) => {
        acc[path.id] = path;
        return acc;
      }, {} as IPathsObject);

      state.paths = {...state.paths, ...newPaths};
    },









    // Действия с вариантами
    createPathVariant: (state, action: PayloadAction<IPathVariant>) => {
      state.paths[action.payload.pathId]
        .variants[action.payload.id] = action.payload;
    },
    deletePathVariant: (state, action: PayloadAction<IPathVariant>) => {
      const variant = action.payload
      for (const point of Object.values(variant.path)) {
        if (point.markerId) {
          state.paths[variant.pathId].markers[point.markerId].points = state.paths[variant.pathId].markers[point.markerId].points.filter(x => x.id != point.id)
        }
      }
      delete state.paths[variant.pathId].variants[variant.id];
    },
    editPathVariant: (state, action: PayloadAction<IPathVariant>) => {
      state.paths[action.payload.pathId]
        .variants[action.payload.id] = action.payload;
    },
    // меняет части вариантов
    margeVariantToMain: (state, action: PayloadAction<IPathVariant>) => {
      const variant = action.payload;
      const path = state.paths[variant.pathId];
      const mainVariant = Object.values(path.variants).find(v => v.isMain);

      // проверяем нашлись ли все точки
      if (variant.startMarkerId == undefined 
        || variant.endMarkerId == undefined 
        || mainVariant == undefined) {
        return 
      }

      // находим маркеры и начальную точку от маркера у основного варианта
      const startMarker = path.markers[variant.startMarkerId];
      const endMarker = path.markers[variant.endMarkerId];
      let currenPoint = Object.values(mainVariant.path).find(p => p.markerId == startMarker.id);

      // создаем дублирующий маршрут для того чтобы в дальнейшем поменять его с вторичным
      const currentPath = [{...currenPoint}];

      if (!currenPoint) {
        return 
      }

      // проходит от начала до конца сегмента и удаляет все точки
      while (mainVariant.path[currenPoint.id]?.markerId != endMarker.id && !!currenPoint.nextId) {
        const prevPoint = {...currenPoint}
        currenPoint = mainVariant.path[currenPoint.nextId];
        // добавляем дубликат
        currentPath.push({...currenPoint});
        // удаляем точку
        if (mainVariant.path[prevPoint.id]?.markerId != startMarker.id) {
          const point = prevPoint;
          delete state.paths[point.pathId].variants[point.pathVariantId].path[point.id];
          // есть есть предыдущая точка обновляем для нее nextId
          if (state.paths[point.pathId].variants[point.pathVariantId].path[point.prevId] != undefined) {
            state.paths[point.pathId].variants[point.pathVariantId].path[point.prevId].nextId = point.nextId;
          }
          // есть есть последующая точка обновляем для нее prevId
          if (state.paths[point.pathId].variants[point.pathVariantId].path[point.nextId] != undefined) {
            state.paths[point.pathId].variants[point.pathVariantId].path[point.nextId].prevId = point.prevId;
          }
        }
      }

      // получаем точки у второстепенного маршрута для дальнейшей работы
      const newCurrentPath2 = JSON.parse(JSON.stringify(currentPath.slice(1, -1)));
      const startPointVariant = JSON.parse(JSON.stringify(Object.values(state.paths[path.id].variants[variant.id].path)[0]));
      const endPointVariant = JSON.parse(JSON.stringify(Object.values(state.paths[path.id].variants[variant.id].path)[Object.values(state.paths[path.id].variants[variant.id].path).length - 1]));

      if (!startPointVariant || !endPointVariant) {
        return 
      }

      if (newCurrentPath2.length > 0) {
        // связываем точки
        startPointVariant.nextId = newCurrentPath2[0].id
        newCurrentPath2[0].prevId = startPointVariant.id;

        endPointVariant.prevId = newCurrentPath2[newCurrentPath2.length -1].id; 
        newCurrentPath2[newCurrentPath2.length -1].nextId = endPointVariant.id;
      } else {
        startPointVariant.nextId = endPointVariant.id;
        endPointVariant.prevId = startPointVariant.id;
      }

      

      // получает начальную и конечную точку основного маршрута
      const startPoint = Object.values(state.paths[path.id].variants[mainVariant.id].path).find(p => p.markerId == startMarker.id);
      const endPoint = Object.values(state.paths[path.id].variants[mainVariant.id].path).find(p => p.markerId == endMarker.id);

      if (!startPoint || !endPoint) {
        return 
      }

      // получаем массив вторичного варианта без первой и последней точки
      const points = JSON.parse(JSON.stringify(Object.values(state.paths[path.id].variants[variant.id].path).slice(1, -1)));
      if (points.length > 0) {
        // связываем крайние точки между собой
        startPoint.nextId = points[0].id
        points[0].prevId = startPoint.id;

        endPoint.prevId = points[points.length -1].id; 
        points[points.length -1].nextId = endPoint.id;

        // добавляем измененные точки в путь варианта
        state.paths[variant.pathId].variants[mainVariant.id].path[startPoint.id] = JSON.parse(JSON.stringify(startPoint));
        state.paths[variant.pathId].variants[mainVariant.id].path[endPoint.id] = JSON.parse(JSON.stringify(endPoint));

        for (const point of points) {
          state.paths[variant.pathId].variants[mainVariant.id].path[point.id] = {
            ...point,
            pathVariantId: mainVariant.id,
          };
        }
      }



      // сортируем путь основного варианта
      const newPoints = createOrderedPath(state.paths[variant.pathId].variants[mainVariant.id].path);
      state.paths[variant.pathId].variants[mainVariant.id].path = {};
      for (const point of newPoints) {
        state.paths[variant.pathId].variants[mainVariant.id].path[point.id] = point;
      }
      
      // заменяем данные во вторичном варианте но основной чтобы их не потерять
      if (newCurrentPath2.length > 0) {
        // обновляем данные
        state.paths[variant.pathId].variants[variant.id].path = {};
        state.paths[variant.pathId].variants[variant.id].path[startPointVariant.id] = JSON.parse(JSON.stringify(startPointVariant));
        state.paths[variant.pathId].variants[variant.id].path[endPointVariant.id] = JSON.parse(JSON.stringify(endPointVariant));
        
        for (const point of newCurrentPath2) {
          state.paths[variant.pathId].variants[variant.id].path[point.id] = {
            ...point,
            pathVariantId: variant.id,
          };
        }
      }

      // сортируем точки вторичного варианта
      const newPoints2 = createOrderedPath(state.paths[variant.pathId].variants[variant.id].path);
      state.paths[variant.pathId].variants[variant.id].path = {};
      for (const point of newPoints2) {
        state.paths[variant.pathId].variants[variant.id].path[point.id] = point;
      }



      // обновляем данные по точкам у стартового маркера
      const newStartMarkerPoints = [];
      for (const point of startMarker.points) {
        for (const variant of Object.values(state.paths[path.id].variants)) {
          const findPoint = variant.path[point.id];
          if (findPoint != undefined) {
            newStartMarkerPoints.push(findPoint);
          }
        }
      }
      state.paths[variant.pathId].markers[startMarker.id].points = newStartMarkerPoints;

      // обновляем данные по точкам у конечного маркера
      const newEndMarkerPoints = [];
      for (const point of endMarker.points) {
        for (const variant of Object.values(state.paths[path.id].variants)) {
          const findPoint = variant.path[point.id];
          if (findPoint != undefined) {
            newEndMarkerPoints.push(findPoint);
          }
        }
      }
      state.paths[variant.pathId].markers[endMarker.id].points = newEndMarkerPoints;
    },















    // Действия с точками
    addPoint: (state, action: PayloadAction<IPoint>) => {
      const point = action.payload;
      // добавляем новую точку в объект
      state.paths[point.pathId].variants[point.pathVariantId].path[point.id] = point;
      
      // если есть предыдущая точка то обновляем ей nextId 
      if (state.paths[point.pathId].variants[point.pathVariantId].path[point.prevId] != undefined) {
        state.paths[point.pathId].variants[point.pathVariantId].path[point.prevId].nextId = point.id
      }
    },

    // добавление точки в середину
    addPointBetween: (state, action: PayloadAction<IAddPointBetweenProps>) => {
      const { prevPoint, nextPoint } = action.payload;
      const newPoindId = crypto.randomUUID();
      // вычисляем координаты точки
      const lat = (prevPoint.lat + nextPoint.lat) / 2;
      const lng = (prevPoint.lng + nextPoint.lng) / 2;
      // создаем данные для новой точки
      const newPoint: IPoint = {
        id: newPoindId,
        nextId: nextPoint.id,
        prevId: prevPoint.id,
        pathId: prevPoint.pathId,
        pathVariantId: prevPoint.pathVariantId,
        lat,
        lng,
      }
      // создаем новую точку и добавляет ее в объект 
      state.paths[newPoint.pathId].variants[newPoint.pathVariantId].path[newPoint.id] = newPoint;

      // обновляем данные для предыдущей и следующей точки чтобы создать свзязь 0---1---2
      state.paths[prevPoint.pathId].variants[prevPoint.pathVariantId].path[prevPoint.id].nextId = newPoindId;
      state.paths[nextPoint.pathId].variants[nextPoint.pathVariantId].path[nextPoint.id].prevId = newPoindId;

      // обернуть в try catch
      // с помощью самописной функции обновляем порядок точек
      // может херово работать с большим колличеством данных
      const newPoints = createOrderedPath(state.paths[newPoint.pathId].variants[newPoint.pathVariantId].path);
      state.paths[newPoint.pathId].variants[newPoint.pathVariantId].path = newPoints.reduce((acc, point) => {
        acc[point.id] = point;
        return acc;
      }, {} as IPathVariantPointsObject);
    },

    
    // полностью обновляем путь
    addManyPoint: (state, action: PayloadAction<IAddManyPointsProps>) => {
      state.paths[action.payload.pathId].variants[action.payload.pathVariantId].path = action.payload.points;
    },


    // переписывает данные для всего маршрута
    // на основе пути из бэка, который был обработан graphhopperом
    addManyPointFromMathed: (state, action: PayloadAction<IAddManyPointsFromMatchedProps>) => {
      const {pathId, pathVariantId, poinstArray} = action.payload;

      // todo вынести логику в helper она повторяется
      const path = poinstArray.map(x => ({
        id: crypto.randomUUID(),
        nextId: '',
        prevId: '',
        pathId: pathId,
        pathVariantId: pathVariantId,
        lat: x[0],
        lng: x[1],
      } as IPoint)).reduce((acc: IPathVariantPointsObject, point, index, arr) => {
        if (index > 0) {
          point.prevId = arr[index - 1].id;
        }
        if (index < arr.length - 1) {
          point.nextId = arr[index + 1].id;
        }
        return {...acc, [point.id]: point};
      }, {} as IPathVariantPointsObject);

      state.paths[pathId].variants[pathVariantId].path = path;
    },

    editPoint: (state, action: PayloadAction<IPoint>) => {
     state.paths[action.payload.pathId].variants[action.payload.pathVariantId].path[action.payload.id] = action.payload;
    },

    deletePoint: (state, action: PayloadAction<IPoint>) => {
      const point = action.payload;
      delete state.paths[point.pathId].variants[point.pathVariantId].path[point.id];
      // есть есть предыдущая точка обновляем для нее nextId
      if (state.paths[point.pathId].variants[point.pathVariantId].path[point.prevId] != undefined) {
        state.paths[point.pathId].variants[point.pathVariantId].path[point.prevId].nextId = point.nextId;
      }
      // есть есть последующая точка обновляем для нее prevId
      if (state.paths[point.pathId].variants[point.pathVariantId].path[point.nextId] != undefined) {
        state.paths[point.pathId].variants[point.pathVariantId].path[point.nextId].prevId = point.prevId;
      }
    },








    // действия с маркерами
    addMarker: (state, action: PayloadAction<IMarker>) => {
      const marker = action.payload;
      state.paths[marker.pathId].markers[marker.id] = marker;
      
      for (const point of marker.points) {
        state.paths[point.pathId].variants[point.pathVariantId].path[point.id] = point;
      }
      // точке на которую нажимую нуэно так же добавлять 
    },
    editMarker: (state, action: PayloadAction<IMarker>) => {
      const marker = action.payload;
      state.paths[marker.pathId].markers[marker.id] = marker;
      for (const point of marker.points) {
        state.paths[marker.pathId].variants[point.pathVariantId].path[point.id] = {...point, lat: marker.lat, lng: marker.lng};
      }
    },
    deleteMarker: (state, action: PayloadAction<IMarker>) => {
      const marker = action.payload;
      delete state.paths[marker.pathId].markers[marker.id];
    },
  },
})

export const { 
  addPath, 
  deletePath, 
  editPath, 
  addPathFromImport,
  addPathsFromNames,

  createPathVariant, 
  deletePathVariant, 
  editPathVariant, 
  margeVariantToMain,

  addPoint, 
  addPointBetween,
  addManyPoint,
  addManyPointFromMathed,
  editPoint, 
  deletePoint,

  addMarker,
  editMarker,
  deleteMarker,
} = pathSlice.actions

export default pathSlice.reducer