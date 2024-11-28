import SearchableLayout from "@/components/searchable-layout";
import { useRouter } from "next/router";
import { ReactNode } from "react";
// import books from "@/mock/books.json";
import BookItem from "@/components/book-item";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import fetchBooks from "@/lib/fetch-books";

/*
   // [!] GetServerSidePropsContext의 context 매개변수에는 현재 브라우저 로부터 바등ㄴ 요청에 대한 모든 정보가 담겨있음
          즉, url의 queryString, parameter 등의 값을 가져오고 싶을 때, GetServerSidePropsContext를 쓰면 됨

*/
export const getServerSideProps = async (
  context: GetServerSidePropsContext         
) => {
  console.log(context)

  const q = context.query.q;
  const books = await fetchBooks(q as string)
  

  return { 
    props: { books }
  }
}

export default function Page({books}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
