import { Polyline } from "react-leaflet"
import { useSelector } from "react-redux"
import type { RootState } from "../../providers/store"
import type { IPathVariant } from "../../services/types/Path"
import { useCallback } from "react"



const Lines = () => {
  const paths = useSelector((state: RootState) => state.pathObject.paths)
  const variantId = useSelector((state: RootState) => state.currentPathVariantId.currentPathVariantId);
  const pathId = useSelector((state: RootState) => state.currentPathId.currentPathId);

  const isLineVisible = useCallback((x: IPathVariant) => {
    if (x.id == variantId) {
      return false;
    } else if (x.isVisible == false) {
      return false
    } else if (x.pathId == pathId) {
      return true
    } else if (x.isMain) {
      return true
    }
    // return x.id != variantId && paths[pathId].variants[variantId].isMain;
  }, [pathId, variantId])

  return <>
    {Object.values(paths).filter(x => x.checked)
      .map(x => Object.values(x.variants).filter(isLineVisible)
        .map(y => 
          <div key={y.id}>
            <Polyline 
              pathOptions={{ 
                color: y.color,
                weight: 4,
              }} 
              positions={Object.values(y.path).map(t => [t.lat, t.lng])} 
              // positions={createOrderedPath(y.path).map(t => [t.lat, t.lng])} 
              eventHandlers={{}}
            />
          </div>
        )
      )
    }
  </>
}

export default Lines