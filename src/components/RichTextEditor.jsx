"use client"

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from "next/dynamic";

const Editor = dynamic(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    { ssr:false }
)

export default function RichTextEditor(props) {
  return (
    <Editor 
     {...props}
     editorStyle={{
        border: "1px solid lightGrey",
        borderRadius: "4px",
        paddingInline:  "8px",
        minHeight: "140px",
        cursor: "text",
     }}
     toolbar={{
        options: ["inline", "list", "link", "history"],
        inline: {
            options:["bold", "italic",  "underline"]
        }
     }}
    />
  )
}
