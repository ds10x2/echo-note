import * as St from "@/components/common/EditButton.style";

const EditButton = ({ buttonText, onClick }) => {
  return <St.Button onClick={onClick}>{buttonText}</St.Button>;
};

export default EditButton;
