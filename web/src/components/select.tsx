import { FormControl, InputLabel, MenuItem, Select } from '@suid/material';
import { SelectChangeEvent } from '@suid/material/Select';
import { createSignal } from 'solid-js';

export const ScaledSelect = () => {
  const [age, setAge] = createSignal('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 100
      }}
    >
      <InputLabel id="demo-simple-select-autowidth-label">Sort by</InputLabel>
      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        autoWidth
        value={age()}
        onChange={handleChange}
        label="Sort by"
      >
        <MenuItem value="">
          <em>Default</em>
        </MenuItem>
        <MenuItem value={10}>Name</MenuItem>
        <MenuItem value={21}>Date Added</MenuItem>
        <MenuItem value={22}>Rating</MenuItem>
      </Select>
    </FormControl>
  );
};
