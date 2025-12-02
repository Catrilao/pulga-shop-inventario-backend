--
-- PostgreSQL database dump
--

\restrict 2yhltZ4q5KbKfOhWv9bXS1f6CVqeegemVMDkVzAxKpSMlhvp9vsDBGdwDIkMIYR

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-12-01 13:57:25

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 860 (class 1247 OID 16510)
-- Name: categoria_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.categoria_enum AS ENUM (
    'ELECTRÓNICA',
    'ROPA',
    'CALZADO',
    'HOGAR',
    'JUGUETES',
    'DEPORTES',
    'LIBROS',
    'ALIMENTOS',
    'BELLEZA',
    'OFICINA',
    'AUTOMOTRIZ',
    'MASCOTAS',
    'GENERAL'
);


ALTER TYPE public.categoria_enum OWNER TO postgres;

--
-- TOC entry 857 (class 1247 OID 16503)
-- Name: condicion_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.condicion_enum AS ENUM (
    'NUEVO',
    'USADO',
    'REACONDICIONADO'
);


ALTER TYPE public.condicion_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16538)
-- Name: ciudad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ciudad (
    id_ciudad integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.ciudad OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16537)
-- Name: ciudad_id_ciudad_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ciudad_id_ciudad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ciudad_id_ciudad_seq OWNER TO postgres;

--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 219
-- Name: ciudad_id_ciudad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ciudad_id_ciudad_seq OWNED BY public.ciudad.id_ciudad;


--
-- TOC entry 224 (class 1259 OID 16573)
-- Name: producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto (
    id_producto integer NOT NULL,
    id_tienda integer NOT NULL,
    nombre character varying(100) NOT NULL,
    stock integer NOT NULL,
    costo integer CONSTRAINT producto_precio_not_null NOT NULL,
    sku character varying(36) NOT NULL,
    condicion public.condicion_enum DEFAULT 'NUEVO'::public.condicion_enum,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    marca character varying(50) DEFAULT 'Genérica'::character varying,
    categoria public.categoria_enum DEFAULT 'GENERAL'::public.categoria_enum,
    descripcion text DEFAULT 'Sin descripción'::text,
    activo boolean DEFAULT true,
    foto_referencia text,
    peso numeric(4,1) DEFAULT 0.0,
    alto integer DEFAULT 0,
    largo integer DEFAULT 0,
    ancho integer DEFAULT 0
);


ALTER TABLE public.producto OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16572)
-- Name: producto_id_producto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_id_producto_seq OWNER TO postgres;

--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 223
-- Name: producto_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_id_producto_seq OWNED BY public.producto.id_producto;


--
-- TOC entry 222 (class 1259 OID 16549)
-- Name: tienda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tienda (
    id_tienda integer NOT NULL,
    id_vendedor character varying(24) NOT NULL,
    nombre character varying(100) NOT NULL,
    id_ciudad integer NOT NULL,
    direccion character varying(200) NOT NULL,
    descripcion text NOT NULL,
    telefono character varying(20) NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    online boolean NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE public.tienda OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16548)
-- Name: tienda_id_tienda_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tienda_id_tienda_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tienda_id_tienda_seq OWNER TO postgres;

--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 221
-- Name: tienda_id_tienda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tienda_id_tienda_seq OWNED BY public.tienda.id_tienda;


--
-- TOC entry 4872 (class 2604 OID 16541)
-- Name: ciudad id_ciudad; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad ALTER COLUMN id_ciudad SET DEFAULT nextval('public.ciudad_id_ciudad_seq'::regclass);


--
-- TOC entry 4876 (class 2604 OID 16576)
-- Name: producto id_producto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto ALTER COLUMN id_producto SET DEFAULT nextval('public.producto_id_producto_seq'::regclass);


--
-- TOC entry 4873 (class 2604 OID 16552)
-- Name: tienda id_tienda; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tienda ALTER COLUMN id_tienda SET DEFAULT nextval('public.tienda_id_tienda_seq'::regclass);


--
-- TOC entry 5045 (class 0 OID 16538)
-- Dependencies: 220
-- Data for Name: ciudad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ciudad (id_ciudad, nombre) FROM stdin;
1	Arica
2	Camarones
3	General Lagos
4	Putre
5	Alto Hospicio
6	Iquique
7	Camiña
8	Colchane
9	Huara
10	Pica
11	Pozo Almonte
12	Antofagasta
13	Mejillones
14	Sierra Gorda
15	Taltal
16	Calama
17	Ollague
18	San Pedro de Atacama
19	María Elena
20	Tocopilla
21	Chañaral
22	Diego de Almagro
23	Caldera
24	Copiapó
25	Tierra Amarilla
26	Alto del Carmen
27	Freirina
28	Huasco
29	Vallenar
30	Canela
31	Illapel
32	Los Vilos
33	Salamanca
34	Andacollo
35	Coquimbo
36	La Higuera
37	La Serena
38	Paihuaco
39	Vicuña
40	Combarbalá
41	Monte Patria
42	Ovalle
43	Punitaqui
44	Río Hurtado
45	Isla de Pascua
46	Calle Larga
47	Los Andes
48	Rinconada
49	San Esteban
50	La Ligua
51	Papudo
52	Petorca
53	Zapallar
54	Hijuelas
55	La Calera
56	La Cruz
57	Limache
58	Nogales
59	Olmué
60	Quillota
61	Algarrobo
62	Cartagena
63	El Quisco
64	El Tabo
65	San Antonio
66	Santo Domingo
67	Catemu
68	Llaillay
69	Panquehue
70	Putaendo
71	San Felipe
72	Santa María
73	Casablanca
74	Concón
75	Juan Fernández
76	Puchuncaví
77	Quilpué
78	Quintero
79	Valparaíso
80	Villa Alemana
81	Viña del Mar
82	Colina
83	Lampa
84	Tiltil
85	Pirque
86	Puente Alto
87	San José de Maipo
88	Buin
89	Calera de Tango
90	Paine
91	San Bernardo
92	Alhué
93	Curacaví
94	María Pinto
95	Melipilla
96	San Pedro
97	Cerrillos
98	Cerro Navia
99	Conchalí
100	El Bosque
101	Estación Central
102	Huechuraba
103	Independencia
104	La Cisterna
105	La Granja
106	La Florida
107	La Pintana
108	La Reina
109	Las Condes
110	Lo Barnechea
111	Lo Espejo
112	Lo Prado
113	Macul
114	Maipú
115	Ñuñoa
116	Pedro Aguirre Cerda
117	Peñalolén
118	Providencia
119	Pudahuel
120	Quilicura
121	Quinta Normal
122	Recoleta
123	Renca
124	San Miguel
125	San Joaquín
126	San Ramón
127	Santiago
128	Vitacura
129	El Monte
130	Isla de Maipo
131	Padre Hurtado
132	Peñaflor
133	Talagante
134	Codegua
135	Coínco
136	Coltauco
137	Doñihue
138	Graneros
139	Las Cabras
140	Machalí
141	Malloa
142	Mostazal
143	Olivar
144	Peumo
145	Pichidegua
146	Quinta de Tilcoco
147	Rancagua
148	Rengo
149	Requínoa
150	San Vicente de Tagua Tagua
151	La Estrella
152	Litueche
153	Marchihue
154	Navidad
155	Peredones
156	Pichilemu
157	Chépica
158	Chimbarongo
159	Lolol
160	Nancagua
161	Palmilla
162	Peralillo
163	Placilla
164	Pumanque
165	San Fernando
166	Santa Cruz
167	Cauquenes
168	Chanco
169	Pelluhue
170	Curicó
171	Hualañé
172	Licantén
173	Molina
174	Rauco
175	Romeral
176	Sagrada Familia
177	Teno
178	Vichuquén
179	Colbún
180	Linares
181	Longaví
182	Parral
183	Retiro
184	San Javier
185	Villa Alegre
186	Yerbas Buenas
187	Constitución
188	Curepto
189	Empedrado
190	Maule
191	Pelarco
192	Pencahue
193	Río Claro
194	San Clemente
195	San Rafael
196	Talca
197	Arauco
198	Cañete
199	Contulmo
200	Curanilahue
201	Lebu
202	Los Álamos
203	Tirúa
204	Alto Biobío
205	Antuco
206	Cabrero
207	Laja
208	Los Ángeles
209	Mulchén
210	Nacimiento
211	Negrete
212	Quilaco
213	Quilleco
214	San Rosendo
215	Santa Bárbara
216	Tucapel
217	Yumbel
218	Chiguayante
219	Concepción
220	Coronel
221	Florida
222	Hualpén
223	Hualqui
224	Lota
225	Penco
226	San Pedro de La Paz
227	Santa Juana
228	Talcahuano
229	Tomé
230	Bulnes
231	Chillán
232	Chillán Viejo
233	Cobquecura
234	Coelemu
235	Coihueco
236	El Carmen
237	Ninhue
238	Ñiquen
239	Pemuco
240	Pinto
241	Portezuelo
242	Quillón
243	Quirihue
244	Ránquil
245	San Carlos
246	San Fabián
247	San Ignacio
248	San Nicolás
249	Treguaco
250	Yungay
251	Carahue
252	Cholchol
253	Cunco
254	Curarrehue
255	Freire
256	Galvarino
257	Gorbea
258	Lautaro
259	Loncoche
260	Melipeuco
261	Nueva Imperial
262	Padre Las Casas
263	Perquenco
264	Pitrufquén
265	Pucón
266	Saavedra
267	Temuco
268	Teodoro Schmidt
269	Toltén
270	Vilcún
271	Villarrica
272	Angol
273	Collipulli
274	Curacautín
275	Ercilla
276	Lonquimay
277	Los Sauces
278	Lumaco
279	Purén
280	Renaico
281	Traiguén
282	Victoria
283	Corral
284	Lanco
285	Los Lagos
286	Máfil
287	Mariquina
288	Paillaco
289	Panguipulli
290	Valdivia
291	Futrono
292	La Unión
293	Lago Ranco
294	Río Bueno
295	Ancud
296	Castro
297	Chonchi
298	Curaco de Vélez
299	Dalcahue
300	Puqueldón
301	Queilén
302	Quemchi
303	Quellón
304	Quinchao
305	Calbuco
306	Cochamó
307	Fresia
308	Frutillar
309	Llanquihue
310	Los Muermos
311	Maullín
312	Puerto Montt
313	Puerto Varas
314	Osorno
315	Puero Octay
316	Purranque
317	Puyehue
318	Río Negro
319	San Juan de la Costa
320	San Pablo
321	Chaitén
322	Futaleufú
323	Hualaihué
324	Palena
325	Aisén
326	Cisnes
327	Guaitecas
328	Cochrane
329	O'higgins
330	Tortel
331	Coihaique
332	Lago Verde
333	Chile Chico
334	Río Ibáñez
335	Antártica
336	Cabo de Hornos
337	Laguna Blanca
338	Punta Arenas
339	Río Verde
340	San Gregorio
341	Porvenir
342	Primavera
343	Timaukel
344	Natales
345	Torres del Paine
\.


--
-- TOC entry 5049 (class 0 OID 16573)
-- Dependencies: 224
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producto (id_producto, id_tienda, nombre, stock, costo, sku, condicion, fecha_creacion, marca, categoria, descripcion, activo, foto_referencia, peso, alto, largo, ancho) FROM stdin;
1	1	Notebook Gamer ASUS	5	850000	NB-ASUS-001	NUEVO	2025-12-01 13:55:56.388772	ASUS	ELECTRÓNICA	Laptop alta gama	t	http://img/asus.jpg	2.5	2	35	25
2	1	Monitor Samsung 24"	3	60000	MON-SAM-002	USADO	2025-12-01 13:55:56.388772	Samsung	ELECTRÓNICA	Monitor con leve uso	t	http://img/mon.jpg	4.0	40	60	10
3	2	Teclado Mecánico	10	45000	KEY-LOG-003	REACONDICIONADO	2025-12-01 13:55:56.388772	Logitech	ELECTRÓNICA	Teclado reparado por fabrica	t	http://img/key.jpg	1.0	4	45	15
4	2	Mouse Gamer	20	35000	MOU-RAZ-004	NUEVO	2025-12-01 13:55:56.388772	Razer	ELECTRÓNICA	Mouse sellado	t	http://img/mouse.jpg	0.1	4	12	7
5	3	Chaqueta Cuero	8	120000	CH-CUE-005	USADO	2025-12-01 13:55:56.388772	Zara	ROPA	Vintage en buen estado	t	http://img/chaq.jpg	0.8	0	0	0
6	3	Zapatillas Urbanas	15	50000	ZAP-NIK-006	REACONDICIONADO	2025-12-01 13:55:56.388772	Nike	CALZADO	Suela restaurada	t	http://img/zap.jpg	0.9	10	30	15
7	4	Polera Estampada	50	15000	POL-GEN-007	NUEVO	2025-12-01 13:55:56.388772	Genérica	ROPA	Algodón 100%	t	http://img/pol.jpg	0.2	0	0	0
8	4	Jeans Clasicos	12	20000	JEA-LEV-008	USADO	2025-12-01 13:55:56.388772	Levis	ROPA	Segunda mano	t	http://img/jeans.jpg	0.6	0	0	0
9	5	Licuadora Pro	7	30000	LIC-OST-009	REACONDICIONADO	2025-12-01 13:55:56.388772	Oster	HOGAR	Motor cambiado	t	http://img/lic.jpg	2.2	40	20	20
10	5	Microondas Digital	4	80000	MIC-LG-010	NUEVO	2025-12-01 13:55:56.388772	LG	HOGAR	En caja original	t	http://img/mic.jpg	12.0	30	50	40
11	6	Refrigerador SideBySide	2	400000	REF-SAM-011	USADO	2025-12-01 13:55:56.388772	Samsung	HOGAR	Detalles estéticos puerta	t	http://img/ref.jpg	80.0	180	90	70
12	6	Lavadora Carga Frontal	3	250000	LAV-BOS-012	REACONDICIONADO	2025-12-01 13:55:56.388772	Bosch	HOGAR	Panel electrónico nuevo	t	http://img/lav.jpg	65.0	85	60	60
\.


--
-- TOC entry 5047 (class 0 OID 16549)
-- Dependencies: 222
-- Data for Name: tienda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tienda (id_tienda, id_vendedor, nombre, id_ciudad, direccion, descripcion, telefono, fecha_creacion, online, activo) FROM stdin;
1	VEND_001	TecnoCentral Santiago	1	Av. Providencia 1234	Especialistas en hardware	+56911111111	2025-12-01 13:55:56.388772	t	t
2	VEND_001	TecnoCentral Valpo	2	Calle Prat 456	Sucursal puerto	+56911111112	2025-12-01 13:55:56.388772	t	t
3	VEND_002	Moda Urbana	1	Paseo Ahumada 55	Tendencias	+56922222221	2025-12-01 13:55:56.388772	f	t
4	VEND_002	Moda Urbana Sur	3	Calle O Higgins 890	Sucursal Concepción	+56922222222	2025-12-01 13:55:56.388772	t	t
5	VEND_003	ElectroHogar	4	Av. del Mar 500	Electrodomésticos	+56933333331	2025-12-01 13:55:56.388772	t	t
6	VEND_003	ElectroHogar Stgo	1	Av. Las Condes 9000	Showroom Santiago	+56933333332	2025-12-01 13:55:56.388772	t	t
\.


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 219
-- Name: ciudad_id_ciudad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ciudad_id_ciudad_seq', 345, true);


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 223
-- Name: producto_id_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_id_producto_seq', 12, true);


--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 221
-- Name: tienda_id_tienda_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tienda_id_tienda_seq', 6, true);


--
-- TOC entry 4888 (class 2606 OID 16547)
-- Name: ciudad ciudad_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad
    ADD CONSTRAINT ciudad_nombre_key UNIQUE (nombre);


--
-- TOC entry 4890 (class 2606 OID 16545)
-- Name: ciudad ciudad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad
    ADD CONSTRAINT ciudad_pkey PRIMARY KEY (id_ciudad);


--
-- TOC entry 4894 (class 2606 OID 16596)
-- Name: producto producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (id_producto);


--
-- TOC entry 4892 (class 2606 OID 16566)
-- Name: tienda tienda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tienda
    ADD CONSTRAINT tienda_pkey PRIMARY KEY (id_tienda);


--
-- TOC entry 4896 (class 2606 OID 16597)
-- Name: producto producto_id_tienda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_id_tienda_fkey FOREIGN KEY (id_tienda) REFERENCES public.tienda(id_tienda);


--
-- TOC entry 4895 (class 2606 OID 16567)
-- Name: tienda tienda_id_ciudad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tienda
    ADD CONSTRAINT tienda_id_ciudad_fkey FOREIGN KEY (id_ciudad) REFERENCES public.ciudad(id_ciudad);


-- Completed on 2025-12-01 13:57:26

--
-- PostgreSQL database dump complete
--

\unrestrict 2yhltZ4q5KbKfOhWv9bXS1f6CVqeegemVMDkVzAxKpSMlhvp9vsDBGdwDIkMIYR

