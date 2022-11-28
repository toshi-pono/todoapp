import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  useEditableControls,
  IconButton,
  ButtonGroup,
  Flex,
  Input,
} from '@chakra-ui/react'

interface Props {
  value: string
  onChange?: (value: string) => void
}

const EditableControl = () => {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls()

  return isEditing ? (
    <ButtonGroup
      alignItems="center"
      h="44px"
      justifyContent="center"
      size="sm"
      w="128px"
    >
      <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
      <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    <Flex alignItems="center" h="44px" justifyContent="center" w="128px">
      <IconButton icon={<EditIcon />} size="sm" {...getEditButtonProps()} />
    </Flex>
  )
}

const EditableInputPreview = (props: Props) => {
  return (
    <Editable
      defaultValue={props.value}
      fontSize="2xl"
      isPreviewFocusable={false}
      onChange={(value) => props.onChange?.(value)}
      textAlign="center"
      value={props.value}
    >
      <Flex>
        <EditablePreview w="100%" />
        <Input as={EditableInput} />
        <EditableControl />
      </Flex>
    </Editable>
  )
}

export default EditableInputPreview
