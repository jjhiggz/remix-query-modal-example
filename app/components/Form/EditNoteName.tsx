import type { Note } from "@prisma/client";
import { Form, useMatches } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";

const EditNoteName = ({ noteId }: { noteId: string }) => {
  const matches = useMatches();
  const $noteIdMatch = matches.find(
    (match) => match.id === "routes/notes/$noteId"
  ) as
    | {
        data: {
          note: SerializeFrom<Note>;
        };
      }
    | undefined;

  return (
    <Form
      method="patch"
      action={`/notes/${noteId}`}
      className="flex h-full w-full flex-col items-center justify-center bg-red-300 px-20"
    >
      <div>
        <label htmlFor="title" className="">
          Title:{" "}
        </label>
        <input
          name="title"
          type="text"
          defaultValue={$noteIdMatch?.data.note.title}
        />
        <input type="submit" value="Submit" />
      </div>
    </Form>
  );
};

export default EditNoteName;
