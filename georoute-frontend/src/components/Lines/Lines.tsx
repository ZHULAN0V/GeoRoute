import { Polyline } from "react-leaflet"
import { useSelector } from "react-redux"
import type { RootState } from "../../providers/store"

const Lines = () => {
  const paths = useSelector((state: RootState) => state.pathObject.paths)
  const currentPathVariantId = useSelector((state: RootState) => state.currentPathVariantId.currentPathVariantId)

  return <>
    {Object.values(paths).filter(x => x.checked)
      .map(x => Object.values(x.variants).filter(x => x.id != currentPathVariantId)
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