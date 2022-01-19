import Layout from "../../components/layout";
import BoardList from "./BoardList";
import styles from "../../styles/Board.module.css"
import Link from "next/link";

export default function Board() {
  return (
    <Layout>
      <div className={styles.main}>
        <h1>Board</h1>
        <div className={styles.menus}>
          <Link href="/">
              <a className={styles.link}>공지사항</a>
          </Link>
          <Link href="/">
              <a className={styles.link}>자유게시판</a>
          </Link>
          <Link href="/">
              <a className={styles.link}>질문게시판</a>
          </Link>
          <Link href="/">
              <a className={styles.link}>정보공유</a>
          </Link>
          <Link href="/">
              <a className={styles.link}>사람 구해요</a>
          </Link>
        </div>
        <BoardList />
      </div>
  </Layout>
    
  );
}
