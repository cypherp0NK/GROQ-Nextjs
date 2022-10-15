import imageUrlBuilder from "@sanity/image-url"

export default function BookInfo( {book, bookImage, author} ){
  
    return(
      <div>
        <img src={bookImage} height="350" />
        <div>{book} is a book published by <b>{author}</b> </div>
      </div>
    )
}

async function getAuthor(id){
    const query = encodeURIComponent(`*[ _id == "${id}" ]`)
    const url = `https://3hfiqh43.api.sanity.io/v1/data/query/production?query=${query}`
    const response = await fetch(url).then(res => res.json())
    return(response.result[0].name)
}

export const getServerSideProps = async pageContext => {
    console.log(pageContext)

    const pageSlug = pageContext.query.slug
    const query = encodeURIComponent(`*[ slug.current == "${pageSlug}" && _type == "book" ]`)
    const url = `https://3hfiqh43.api.sanity.io/v1/data/query/production?query=${query}`
    const response = await fetch(url).then(res => res.json())
    const book = response.result[0].name
        
    const builder = imageUrlBuilder({
      projectId: "3hfiqh43",
      dataset: "production",
    })
    const bookImage = builder.image(response.result[0].image).url()

    const author = await getAuthor(response.result[0].author._ref)
    return {
      props: {
        book: book,
        bookImage: bookImage,
        author: author
      }
    }
  }
