import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import fetch from 'node-fetch';
import GlobalHeader from 'components/GlobalHeader';

function Layout({ id }) {
  const [layout, setLayout] = useState();

  useEffect(() => {
    async function fetchLayout() {
      await fetch(`/api/layout/${id}`)
        .then((data) => data.json())
        .then((json) => setLayout(json));
    }

    fetchLayout(id);
  }, [id]);

  return (
    <>
      <GlobalHeader />
      <div className="container section">
        <h1>Layout</h1>
        {console.log('layout', layout)}
      </div>
    </>
  );
}

Layout.propTypes = {
  id: PropTypes.string.isRequired
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  return {
    props: {
      id
    }
  };
}

export default Layout;
