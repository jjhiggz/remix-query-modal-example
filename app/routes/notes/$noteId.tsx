import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

import { deleteNote, getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ userId, id: params.noteId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ note });
}

export async function action({ request, params }: ActionArgs) {
  if (request.method === "DELETE") {
    const userId = await requireUserId(request);
    invariant(params.noteId, "noteId not found");
    await deleteNote({ userId, id: params.noteId });
    return redirect("/notes");
  }
  if (request.method === "PATCH") {
    const formData = await request.formData();
    const title = formData.get("title");
    invariant(params.noteId, "noteId not found");
    if (!title || typeof title !== "string") {
      throw new Error("title should be a string");
    }
    await prisma.note.update({
      where: {
        id: params.noteId,
      },
      data: {
        title,
      },
    });
    return redirect(request.url);
  }
  if (request.method === "post") {
    console.error("unhandled");
  }
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.title}</h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <Link
        className="rounded-md bg-red-500 p-4 text-white"
        to={`?modal-type=delete-note-confirm&delete-note-id=${data.note.id}`}
      >
        Delete Note
      </Link>
      <Link
        className="ml-7 rounded-md bg-blue-500 p-4 text-white"
        to={`?modal-type=edit-note-name&edit-note-id=${data.note.id}`}
      >
        Edit Note Name
      </Link>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
