import Header from '../components/Header'

export default function Layout({
    children
}:Readonly<{
    children:React.ReactNode
}>){
   return(
    <html lang="en">
        <body className="flex">
            <Header />
            <main className="flex-1">{children}</main>
        </body>
        
    </html>
   )

}