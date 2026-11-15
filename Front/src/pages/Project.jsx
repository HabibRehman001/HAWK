import { lazy, Suspense } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProjectPage from '../components/ProjectPage';
import { getProjectPageProps } from '../data/projects';

const Footer = lazy(() => import('../components/Footer'));

function Project() {
  const { slug } = useParams();
  const props = getProjectPageProps(slug);

  if (!props) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-top relative bg-[#040617] min-h-screen text-white overflow-x-hidden max-w-[100vw]">
      <Navbar />
      <ProjectPage key={slug} {...props} />
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default Project;
