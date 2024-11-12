import { supabase } from '../supabaseClient';

// Use Supabase client to fetch data from countries table
export const fetchLesson = async (lessonId: string) => {
	const { data, error } = await supabase.from('lessons').select('*').eq('id', lessonId).single();
	if (error) {
		console.error('Error fetching data', error);
	}
	return data;
};
