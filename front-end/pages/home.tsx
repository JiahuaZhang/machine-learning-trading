import { useState } from 'react';

const Home = () => {
  const [stock, setStock] = useState('');

  return (
    <div>
      <input
        placeholder='Stock'
        type='text'
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
    </div>
  );
};

export default Home;
