import BookItem from "@/components/book-item";
import style from "./page.module.css";
import books from "@/mock/books.json";
import { BookData } from "@/types";


// [!] 특별할 때 아니면 사용 권장 되지 않음
export const dynamic = 'force-dynamic'
/*
  : 라우트 세그먼트 옵션
  : 특정 페이지의 유형을 강제로 Static, Dynamic 페이지로 설정
      1) auto           : 기본값, 아무것도 강제하지 않음
      2) force-dynamic  : 페이지를 강제로 Dynamic 페이지로 설정
      3) force-static   : 페리지를 강제로 Static 페이지로 설정
      4) error          : 페이지를 강제로 Static 페이지로 설정 (설정하면 안되는 이유 - 빌드 오류 (동적라우터 등 사용하면 빌드할 때 오류남))

*/

// [API Components]
async function AllBooks (){
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`, { cache: "no-store"});
  if(!response.ok) {
    return <div>오류가 발생했습니다...</div>
  }
  const allBooks: BookData[] = await response.json();
  console.log(allBooks)  

  return (
    <div>
      {allBooks.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  )
}

async function RecoBooks () {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/random`, { cache: "force-cache"});
  if(!response.ok) {
    return <div>오류가 발생했습니다...</div>
  }
  const recoBooks: BookData[] = await response.json();

  return (
    <div>
      {recoBooks.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  ) 

}



export default function Home() {

  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {/* <RecoBooks /> */}
        {books.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        {/* <AllBooks /> */}
        {books.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
    </div>
  );
}
