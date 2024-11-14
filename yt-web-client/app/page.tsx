/* eslint-disable react/jsx-key */
import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
import { getVideos } from "./firebase/functions";
export default async function Home() {
  const videos = await getVideos();
  return (
    <main>
      {
        videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`}>
            <Image src={'/thumbnail.png'} alt='video' width={120} height={80}
              className={styles.thumbnail}/>
          </Link>
        ))
      }
    </main>
  )
}
