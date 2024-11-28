// CSS Module
import SearchableLayout from "@/components/searchable-layout";
import style from "./index.module.css";
import { ReactNode, useEffect } from "react";
import books from "@/mock/books.json";
import BookItem from "@/components/book-item";
import { InferGetServerSidePropsType } from "next";
import fetchBooks from "@/lib/fetch-books";
import fetchRandomBooks from "@/lib/fetch-random-books";

/* 
  [!] next에 약속된 함수 
  [!] 오직 서버측에서만 실행되는 함수
      때문에 이 함수 안에서 console.log 찍어도 브라우저에서는 확인할 수 없음. 터미널에 찍힘
  [!] 아래 컴포넌트(Home)보다 먼저 실행되어서, 컴포넌트에 필요한 데이터 불러오는 함수
  [!] return 값은 반드시 props라는 키를 포함한 객체(Object) 여야 한다. 
      ex> return {
            props: {
              data,
            }
          }
*/
export const getServerSideProps = async () => {
  console.log('서버사이드props라서 브라우저에서 확인불가, 터미널(Terminal)에서 확인 가능')
  // window.~ 사용 불가 -> window.location, alert, confirm
  const data = "hello";

  // [!] 직렬 호출 (순차적으로 호출됨. -> fetchBooks() 함수 실행 후, fetchRandomBooks() 실행 )
  // const allBooks = await fetchBooks();
  // const recoBooks = await fetchRandomBooks();

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


/* 
  [!]서버에서 한 번, 브라우저에서 한 번, 총 2번 실행됨
      1. 서버측에서 사전 렌더링
      2. 하이드레이션 과정이 진행 될때 한번 더 실행 됨(브라우저에서 자바스크립트 번들 형태로 전달이 되어서 브라우저 측에서 실행이 될 때) 
*/
export default function Home({allBooks, recoBooks}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // 서버쪽(터미널)쪽이랑 브라우저쪽(console) 두 군데 모두 찍힘 
  console.log(allBooks)
  console.log(recoBooks)
  // window.~ 사용 불가 -> window.location, alert, confirm => 여기서도 서버에서 실행되기 때문.(서버에서 실행될때 window를 못찾아서 에러남)

  // useEffect를 사용하면, 브라우저에서만 실행됨. server에서는 실행 안 됨.
  // useEffect(() => {

  // }, [])

  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {/* {books.map((book) => (
          <BookItem key={book.id} {...book} />
        ))} */}
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
