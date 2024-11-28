// CSS Module
import SearchableLayout from "@/components/searchable-layout";
import style from "./index.module.css";
import { ReactNode, useEffect } from "react";
import books from "@/mock/books.json";
import BookItem from "@/components/book-item";
import { InferGetServerSidePropsType, InferGetStaticPropsType } from "next";
import fetchBooks from "@/lib/fetch-books";
import fetchRandomBooks from "@/lib/fetch-random-books";

export const getStaticProps = async () => {

  /*
      [!] SSG 방식으로 사용했기 때문에, 초기 빌드타임 일 때만 실행 되고, 이후부터는 이미 실행되어진 것을 계속 보여줌
      [!] 단, 개발모드로 실행 하면, 항상 실행됨.
          (개발모드에서는 설정해둔 사전 렌더링 방식이 SSG, SSR 뭐든 간에 그냥 요청을 받을 때마다 계속해서 새롭게 페이지를 사전 렌더링 한다. )

  */
  console.log('인덱스 페이지')

  // [!] 병렬 호출
  const [allBooks, recoBooks] = await Promise.all([
    fetchBooks(),
    fetchRandomBooks()
  ])

  return { 
    props: {
      allBooks,
      recoBooks,
    }
  }
}; 

export default function Home({allBooks, recoBooks}: InferGetStaticPropsType<typeof getStaticProps>) {

  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {recoBooks && recoBooks.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        {allBooks && allBooks.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
    </div>
  );
}

Home.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
