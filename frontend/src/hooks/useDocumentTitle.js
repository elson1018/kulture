import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
    useEffect(() => {
        // this will update the browser tab title based on the website page
        document.title = title;
    }, [title]); // Rerun when title changes
};
