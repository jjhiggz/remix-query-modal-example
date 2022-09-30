import { Form } from "@remix-run/react";
import { Link } from "react-router-dom";

export const ConfirmDeleteNote = ({ noteId }: { noteId: string }) => {
  return (
    <Form method="delete" action={`/notes/${noteId}`}>
      <button
        type="submit"
        className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
      >
        Delete
      </button>
      <Link
        to={"/notes"}
        className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
      >
        Cancel
      </Link>
    </Form>
  );
};
