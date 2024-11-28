import SearchableLayout from "@/components/searchable-layout";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
// import books from "@/mock/books.json";
import BookItem from "@/components/book-item";
import { GetServerSidePropsContext, GetStaticPropsContext, InferGetServerSidePropsType } from "next";
import fetchBooks from "@/lib/fetch-books";
import { BookData } from "@/types";
import Head from "next/head";


/*
   [!] SSG는 빌드타임에 미리 렌더링 하는 것으로 query string을 미리 알 수가 없다. 그래서 context에 query가 없다. 
       context.query를 가져와서 fetch하려면 아래 컴포넌트 쪽에서 해야 함.
*/
// export const getStaticProps = async (
//   context: GetStaticPropsContext
// ) => {
//   console.log(context)

//   const q = context.query.q;
//   const books = await fetchBooks(q as string)
  

//   return { 
//     props: { books }
//   }
// }


// **[ SSG + SEO ] ** 
export default function Page() {
  const [books, setBooks] = useState<BookData[]>([]);

  const router = useRouter();
  const q = router.query.q;

  const fetchSearchResult = async () => {
    const data = await fetchBooks(q as string);
    setBooks(data)
  }

  useEffect(() => {
    if(q) {
      fetchSearchResult()
    }
  }, [q])


  return (
    <div>
      {/* [!] SEO, meta tag (메타태그) 설정 */}
    <Head>
      <title>한입북스 - 검색결과</title>
      {/*  [!] content="/~"  -> 경로에  /~  (앞에 슬래시)는 public 폴더를 가리킴  */}
      <meta property="og:image" content="/thumbnail.png" />    
      <meta property="og:title" content="한입북스 - 검색결과" />
      <meta property="og:description" content="ㅎ나입 북스에 등록된 도서들을 만나보세요" />
    </Head>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
