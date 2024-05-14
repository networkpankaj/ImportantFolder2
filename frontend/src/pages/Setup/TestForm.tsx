const TestForm = ({ onClose }) => {
  return (
    <form onSubmit={submit}>
      <input
        type='text'
        name='department'
        placeholder='Enter Departments'
        required
        className='w-full px-4 py-3 text-black border-gray-300 rounded-md'
        onChange={(event) => setDepartment(event.target.value)}
        value={department}
      />
      <button className='mt-4 w-full font-medium rounded-md bg-black px-5 py-3'>
        Submit
      </button>
    </form>
  );
};

export default TestForm;
