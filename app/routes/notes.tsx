import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getNoteListItems } from "~/models/note.server";
import type { ModalAction, ModalProps } from "~/components/modals/Modal";
import Modal from "~/components/modals/Modal";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  const queryParams = new URL(request.url).searchParams;
  const modalAction = queryParams.get("modal-type") as ModalAction | undefined;
  const deleteNoteId = queryParams.get("delete-note-id");
  const editNoteId = queryParams.get("edit-note-id");

  const modalProps = (() => {
    if (modalAction === "delete-note-confirm") {
      if (!deleteNoteId) {
        console.error(
          "must have delete-note-id param if you want to render the 'delete-note-confirm' modal"
        );
        return null;
      }
      return {
        action: "delete-note-confirm",
        deleteNoteId,
      } as ModalProps;
    }
    if (modalAction === "edit-note-name") {
      if (!editNoteId) {
        return null;
      }
      return {
        action: "edit-note-name",
        editNoteId,
      } as ModalProps;
    }
    return null;
  })();

  return json({ noteListItems, modalProps });
}

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="relative flex h-full min-h-screen flex-col ">
      <Modal modalProps={data.modalProps || null} />
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Notes</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Note
          </Link>

          <hr />

          {data.noteListItems.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.noteListItems.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={note.id}
                  >
                    📝 {note.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
