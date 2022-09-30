import type { FC } from "react";
import { ConfirmDeleteNote } from "../Form/ConfirmDeleteNote";
import EditNoteName from "../Form/EditNoteName";

export type ModalAction = "delete-note-confirm" | "edit-note-name";

export type ModalProps =
  | {
      action: "delete-note-confirm";
      deleteNoteId: string;
    }
  | {
      action: "edit-note-name";
      editNoteId: string;
    }
  | null;

const ModalContainer: FC<{
  modalProps: ModalProps;
}> = ({ modalProps }) => {
  return (
    <div
      className="absolute ml-64 mt-64 h-1/2 w-1/2 border-2 border-black bg-white"
      hidden={!modalProps}
    >
      <>
        {modalProps?.action === "delete-note-confirm" && (
          <ConfirmDeleteNote noteId={modalProps.deleteNoteId} />
        )}
        {modalProps?.action === "edit-note-name" && (
          <EditNoteName noteId={modalProps.editNoteId} />
        )}
      </>
    </div>
  );
};

export default ModalContainer;
