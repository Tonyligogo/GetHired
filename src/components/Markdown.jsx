import ReactMarkdown from "react-markdown"

export default function Markdown({children}) {
  return (
    <ReactMarkdown
    components={{
        ul: (props) => <ul {...props}/>,
        a: (props) => <a {...props}/>
    }}
    >
        {children}
    </ReactMarkdown>
  )
}
