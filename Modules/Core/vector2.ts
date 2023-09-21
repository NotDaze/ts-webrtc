


export default class Vector2 {
	
	public x = 0;
	public y = 0;
	
	constructor(x = 0, y = 0) {
		
		this.x = x;
		this.y = y;
		
	}
	
	
	
	static add(v1: Vector2, v2: Vector2): Vector2 {
		return v1.duplicate().add(v2);
	}
	static subtract(v1: Vector2, v2: Vector2): Vector2 {
		return v1.duplicate().subtract(v2);
	}
	static multiply(v: Vector2, f: number): Vector2 {
		return v.duplicate().multiply(f);
	}
	static divide(v: Vector2, f: number): Vector2 {
		return v.duplicate().divide(f);
	}
	
	static rotate(v: Vector2, a: number): Vector2 {
		return v.duplicate().rotate(a);
	}
	
	static normalize(v: Vector2) {
		return v.duplicate().normalize();
	}
	
	static lerp(v1: Vector2, v2: Vector2, f: number): Vector2 {
		return v1.duplicate().lerp(v2, f);
	}
	static midpoint(v1: Vector2, v2: Vector2): Vector2 {
		return v1.duplicate().lerp(v2, 0.5);
	}
	
	
	
	
	// Informational
	mag(): number {
		return Math.sqrt(this.magSq());
	}
	magSq(): number {
		return this.x * this.x + this.y * this.y;
	}
	dist(v: Vector2): number {
		return Math.sqrt(this.distSq(v));
	}
	distSq(v: Vector2): number {
		
		let x = this.x - v.x;
		let y = this.y - v.x;
		
		return x * x + y * y;
		
	}
	
	dot(v: Vector2): number {
		return this.x * v.x + this.y * v.y;
	}
	
	// Manipulation
	duplicate(): Vector2 {
		return new Vector2(this.x, this.y);
	}
	set(x: number, y: number): Vector2 {
		
		this.x = x;
		this.y = y;
		return this;
		
	}
	
	add(v: Vector2): Vector2 {
		
		this.x += v.x;
		this.y += v.y;
		
		return this;
		
	}
	subtract(v: Vector2): Vector2 {
		
		this.x -= v.x;
		this.y -= v.y;
		
		return this;
		
	}
	multiply(f: number): Vector2 {
		
		this.x *= f;
		this.y *= f;
		
		return this;
		
	}
	divide(f: number): Vector2 {
		
		this.x /= f;
		this.y /= f;
		
		return this;
		
	}
	
	normalize(): Vector2 {
		return this.divide(this.mag());
	}
	
	rotate(a: number): Vector2 {
		
		let cos = Math.cos(a);
		let sin = Math.sin(a);
		
		return this.set(
			this.x * cos - this.y * sin,
			this.x * sin + this.y * cos
		);
		
	}
	
	lerp(v: Vector2, f: number): Vector2 {
		
		this.x += (v.x - this.x) * f;
		this.y += (v.y - this.y) * f;
		
		return this;
		
	}
	
	
	
	
}





