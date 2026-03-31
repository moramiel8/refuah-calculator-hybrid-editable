import React, { useState } from "react";
import { Modal, FormInput, Loadbar } from "@/shared/ui";
import { useForgotPassword } from "@/features/auth";

interface Props {
  display: boolean;
  toggleModal: (val: boolean) => void;
}

const ForgotPasswordModal: React.FC<Props> = ({ display, toggleModal }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const mutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await mutation.mutateAsync(email);
      setSent(true);
    } catch {
      // error handled by mutation
    }
  };

  return (
    <Modal display={display} toggleModal={toggleModal} title="שכחתי סיסמה">
      {sent ? (
        <p className="text-success">הקישור לאיפוס נשלח לדואר האלקטרוני שלך</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormInput
            type="email"
            label="דואר אלקטרוני"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground"
            >
              שליחת קישור
            </button>
            {mutation.isPending && <Loadbar small />}
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal;
