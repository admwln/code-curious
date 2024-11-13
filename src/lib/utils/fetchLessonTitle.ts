import { supabase } from '../supabaseClient';

// Use Supabase client to fetch data from countries table
export const fetchLessonTitle = async (lessonSlug: string) => {
	const { data, error } = await supabase
		.from('lessons')
		.select('title')
		.eq('slug', lessonSlug)
		.single();
	if (error) {
		console.error('Error fetching data', error);
	}
	return data;
};
