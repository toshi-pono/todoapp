import { useCallback, useState } from 'react'

import { SearchIcon } from '@chakra-ui/icons'
import {
  FormControl,
  FormLabel,
  Flex,
  Input,
  Select,
  Button,
  Box,
  Text,
} from '@chakra-ui/react'

export interface SearchArgs {
  keyword?: string
  done?: string
}

interface Props {
  onChange: (args: SearchArgs) => void
}

const SearchForm = ({ onChange }: Props) => {
  const [form, setForm] = useState<SearchArgs>({})

  const handleFormInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }))
    },
    []
  )
  const handleFormSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      let value: 'yes' | 'no' | 'none'
      if (e.target.value === 'yes') {
        value = 'yes'
      } else if (e.target.value === 'no') {
        value = 'no'
      } else {
        value = 'none'
      }

      setForm((prev) => ({
        ...prev,
        [e.target.name]: value,
      }))
    },
    []
  )
  const searchHandler = useCallback(() => {
    onChange({
      keyword: form.keyword,
      done: form.done === 'none' ? undefined : form.done,
    })
  }, [form, onChange])
  return (
    <Box>
      <Flex>
        <FormControl mr="1" w="100%">
          <FormLabel>キーワード</FormLabel>
          <Input
            name="keyword"
            onChange={handleFormInputChange}
            placeholder="keyword"
            value={form.keyword ?? ''}
          />
        </FormControl>
        <FormControl maxW="200px" ml="1">
          <FormLabel>完了したかどうか</FormLabel>
          <Select
            name="done"
            onChange={handleFormSelectChange}
            value={form.done}
          >
            <option value="none">選択しない</option>
            <option value="yes">完了</option>
            <option value="no">未完了</option>
          </Select>
        </FormControl>
      </Flex>
      <Flex justifyContent="right">
        <Button mt="2" onClick={searchHandler} w="100px">
          <Text mr="1">検索</Text> <SearchIcon />
        </Button>
      </Flex>
    </Box>
  )
}

export default SearchForm
