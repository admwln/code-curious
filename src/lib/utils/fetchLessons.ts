import { supabase } from '../supabaseClient';

// Use Supabase client to fetch data from countries table
export const fetchLessons = async () => {
	const { data, error } = await supabase.from('lessons').select('*');
	if (error) {
		console.error('Error fetching data', error);
	}
	return data;
};
