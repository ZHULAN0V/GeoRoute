// import { useMutation, useQuery, skipToken, useQueryClient } from "@tanstack/react-query"
import Map from "./components/Map/Map"
import BottomMenu from "./widgets/BottomMenu/BottomMenu"
import LeftMenu from "./widgets/LeftMenu/LeftMenu"
import RightMenu from "./widgets/RightMenu/RightMenu"
// import { useState } from "react"
// import { useMatchRouteMutation } from "./hooks/usePostMatchMap"
// import { use, useEffect } from "react"
// import { useGetPaths } from "./hooks/useGetFiles"

function App() {
  // const queryClient = useQueryClient();
  // const posts = useQuery({
  //   queryKey: ["posts"],
  //   queryFn: ({signal}) => true ? axios.get("https://jsonplaceholder.typicode.com/posts", {signal}).then(res => res.data) : skipToken,
  //   retry: 4,
  //   staleTime: 1000 * 30,
  //   enabled: true,
  //   // initialData: [], // не будут запрашиваться пока не устареют 
  //   placeholderData: [], // будут отображаться пока данные не загрузятся типо скелетон
  // });

  // const notifications = useQuery({
  //   queryKey: ["notifications"],
  //   queryFn: ({signal}) => false ? axios.get("https://jsonplaceholder.typicode.com/notifications", {signal}).then(res => res.data) : skipToken,
  //   retry: 4,
  //   refetchInterval: 1000 * 60,
  // });

  // const invalidatePosts = () => {
  //   posts.refetch();
  //   queryClient.invalidateQueries({ queryKey: ["posts"] });
  // }

  // const cancelPosts = () => {
  //   queryClient.cancelQueries({ queryKey: ["posts"] });
  // }

  // const postsMutation = useMutation({
  //   queryFn: () => axios.get("https://jsonplaceholder.typicode.com/posts").then(res => res.data)
  // });

  // console.log(posts.data?.length);
  // console.log(posts.isLoading, posts.isError, posts.error, posts.isSuccess);

  // const { mutate, isPending, error, data } = useMatchRouteMutation();

  // const { data: pathsData, isPending: isPathsPending, error: pathsError }= useGetPaths();

  // useEffect(() => {
  //   console.log(pathsData);
  // }, [pathsData])

  // useEffect(() => {
  //   mutate({ gpxData: `<gpx>
  //     <trk>
  //       <trkseg>
  //         <trkpt lat="51.343657" lon="12.360708"></trkpt>
  //         <trkpt lat="51.343796" lon="12.361337"></trkpt>
  //         <trkpt lat="51.342784" lon="12.361882"></trkpt>
  //       </trkseg>
  //     </trk>
  //   </gpx>`, apiKey: '' });
  //   console.log(data);
  // }, []);

  

  // console.log(data);

  return (
    <>
      <Map/>  
      <BottomMenu/>
      <LeftMenu />
      <RightMenu/>
    </>
  )
}

export default App
