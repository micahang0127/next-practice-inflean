import books from "@/mock/books.json";
import BookItem from "@/components/book-item";
import { BookData } from "@/types";


/*

 [!] 터미널에 기본 props 들이 나타남 (ex> searchParams, params 등) => type 정의할 때 확인할 수 있음
 export default function Page(props) 
      console.log(props)                  

*/
export default async function Page({
  searchParams,
}: {
  searchParams: {
    q?: string;
  };
}) {

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?1=${searchParams.q}`)
  if(!response.ok) {
    return <div>오류가 발생했습니다..</div>
  }
  const books: BookData[] = await response.json()

  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}
